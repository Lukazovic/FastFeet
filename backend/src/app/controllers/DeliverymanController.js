import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';

class DeliverymanControler {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
    });

    try {
      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails' });
      }

      const deliveryman = await Deliveryman.create(req.body);
      return res.json(deliveryman);
    } catch (err) {
      return res.json({ error: err.message });
    }
  }

  async index(req, res) {
    const deliverymans = await Deliveryman.findAll();

    if (!deliverymans) {
      return res.status(404).json({ error: 'There are no users' });
    }

    return res.json(deliverymans);
  }

  async show(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res
        .status(404)
        .json({ error: 'There are no users with the giver ID' });
    }

    return res.json(deliveryman);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res
        .status(404)
        .json({ error: 'There are no users with the giver ID' });
    }

    const { email } = req.body;

    if (email !== deliveryman.email) {
      const isEmailTaken = await Deliveryman.findOne({ where: { email } });

      if (isEmailTaken) {
        return res
          .status(401)
          .json({ error: 'The givin email is already in use' });
      }
    }

    const updatedDeliveryman = await deliveryman.update(req.body);

    return res.json(updatedDeliveryman);
  }

  async delete(req, res) {
    await Deliveryman.destroy({
      where: { id: req.params.id },
    });

    return res.json({ succes: 'User deleted' });
  }
}

export default new DeliverymanControler();
